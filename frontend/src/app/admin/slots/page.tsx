  'use client';

  import {useEffect,useState,useCallback} from 'react';
  import {
    RefreshCw,
    Plus,
    Ban,
    ChevronLeft,
    ChevronRight,
  } from 'lucide-react';

  import {api} from '@/lib/api';
  import {formatDate,formatTime} from '@/lib/utils';

  import {toast} from '@/components/ui/Toaster';

  import {
    AdminPage,
    Card,
    CardHeader,
    Table,
    Badge,
    Btn,
    Modal,
    Field,
    inputCls,
    StatCard,
  } from '@/components/admin/AdminUI';

  type Slot={
    _id:string;
    startAt:string;
    endAt:string;
    durationMin:number;
    mode:string;
    status:string;
    heldUntil?:string;

    appointment?:{
      bookingCode:string;
    };

    therapist?:{
      user?:{
        name:string;
      };
    };

    service?:{
      name:string;
    };
  };

  type Therapist={
    _id:string;
    slug:string;

    user:{
      name:string;
    };
  };

  const STATUS_V:Record<
    string,
    'green'|'amber'|'red'|'blue'|'gray'
  >={
    available:'green',
    held:'amber',
    booked:'blue',
    blocked:'red',
  };

  export default function SlotsPage(){

    const [therapists,setTherapists]=
      useState<Therapist[]>([]);

    const [selectedTherapist,
      setSelectedTherapist]=
      useState('');

    const [slots,setSlots]=
      useState<Slot[]>([]);

    const [loading,setLoading]=
      useState(false);

    const [page,setPage]=
      useState(1);

    const [statusFilter,
      setStatusFilter]=
      useState('all');

    const [pagination,
      setPagination]=
      useState({
        total:0,
        pages:1,
        limit:20,
      });

    const [genOpen,setGenOpen]=
      useState(false);

    const [genLoading,
      setGenLoading]=
      useState(false);

    const [genForm,setGenForm]=
      useState({
        from:'',
        to:'',
      });

    const today=
      new Date()
        .toISOString()
        .split('T')[0];

    const in30=
      new Date(
        Date.now()+
        30*86400000
      )
        .toISOString()
        .split('T')[0];

    const [fromDate,
      setFromDate]=
      useState(today);

    const [toDate,
      setToDate]=
      useState(in30);

    useEffect(()=>{

      api
        .get<Therapist[]>(
          '/therapists'
        )
        .then((res)=>{

          setTherapists(res);

          if(res.length>0){
            setSelectedTherapist(
              res[0]._id
            );
          }
        });

    },[]);

    useEffect(()=>{
      setPage(1);
    },[
      selectedTherapist,
      statusFilter,
      fromDate,
      toDate,
    ]);

    const fetchSlots=
      useCallback(async()=>{

        if(!selectedTherapist)
          return;

        setLoading(true);

        try{

          const params=
            new URLSearchParams({
              therapistId:
                selectedTherapist,

              from:
                `${fromDate}T00:00:00Z`,

              to:
                `${toDate}T23:59:59Z`,

              page:
                String(page),

              limit:'20',
            });

          if(
            statusFilter!=='all'
          ){
            params.append(
              'status',
              statusFilter
            );
          }

          const data=
            await api.get<{
              items:Slot[];

              pagination:{
                total:number;
                page:number;
                pages:number;
                limit:number;
              };
            }>(
              `/bookings/admin/slots?${params.toString()}`
            );

          setSlots(data.items);

          setPagination(
            data.pagination
          );

        }catch(e:any){

          toast(
            e.message??
            'Failed to load slots',
            'error'
          );

        }finally{

          setLoading(false);

        }

      },[
        selectedTherapist,
        fromDate,
        toDate,
        statusFilter,
        page,
      ]);

    useEffect(()=>{
      fetchSlots();
    },[fetchSlots]);

    const generateSlots=async()=>{

      if(
        !selectedTherapist||
        !genForm.from||
        !genForm.to
      ){

        toast(
          'Select therapist and date range',
          'error'
        );

        return;
      }

      setGenLoading(true);

      try{

        const data=
          await api.post<{
            created:number;
          }>(
            `/therapists/${selectedTherapist}/generate-slots`,
            {
              from:
                `${genForm.from}T00:00:00Z`,

              to:
                `${genForm.to}T23:59:59Z`,
            }
          );

        toast(
          `Generated ${data.created} slots`,
          'success'
        );

        setGenOpen(false);

        fetchSlots();

      }catch(e:any){

        toast(
          e.message??
          'Failed to generate slots',
          'error'
        );

      }finally{

        setGenLoading(false);

      }
    };

    const toggleSlot=async(
      slotId:string,
      currentlyBlocked:boolean
    )=>{

      try{

        await api.patch(
          `/bookings/slots/${slotId}`,
          {
            status: currentlyBlocked ? 'available' : 'blocked',
          }
        );

        toast(
          currentlyBlocked ? 'Slot unblocked successfully' : 'Slot blocked successfully',
          'success'
        );

        fetchSlots();

      }catch(e:any){

        toast(
          e.message??
          (currentlyBlocked ? 'Failed to unblock slot' : 'Failed to block slot'),
          'error'
        );
      }
    };

    const counts=(st:string)=>
      slots.filter(
        (s)=>s.status===st
      ).length;

    return(
      <AdminPage
        title="Slots"
        subtitle="Manage therapist slots"
        actions={
          <div className="flex gap-2">

            <Btn
              variant="default"
              onClick={fetchSlots}
            >
              <RefreshCw size={14}/>
              Refresh
            </Btn>

            <Btn
              variant="danger"
              onClick={()=>
                setGenOpen(true)
              }
            >
              <Plus size={14}/>
              Generate Slots
            </Btn>

          </div>
        }
      >

        <div className="grid grid-cols-4 gap-4 mb-6">

          <StatCard
            label="Available"
            value={counts(
              'available'
            )}
            color="sage"
          />

          <StatCard
            label="Booked"
            value={counts(
              'booked'
            )}
            color="blue"
          />

          <StatCard
            label="Held"
            value={counts(
              'held'
            )}
            color="amber"
          />

          <StatCard
            label="Blocked"
            value={counts(
              'blocked'
            )}
            color="red"
          />

        </div>

        <Card className="mb-5">

          <div className="p-4 flex flex-wrap gap-4 items-end">

            <Field label="Therapist">

              <select
                className={inputCls}
                value={
                  selectedTherapist
                }
                onChange={(e)=>
                  setSelectedTherapist(
                    e.target.value
                  )
                }
              >

                {therapists.map(
                  (t)=>(

                    <option
                      key={t._id}
                      value={t._id}
                    >
                      {t.user?.name}
                    </option>

                  )
                )}

              </select>

            </Field>

            <Field label="From">

              <input
                type="date"
                className={inputCls}
                value={fromDate}
                onChange={(e)=>
                  setFromDate(
                    e.target.value
                  )
                }
              />

            </Field>

            <Field label="To">

              <input
                type="date"
                className={inputCls}
                value={toDate}
                onChange={(e)=>
                  setToDate(
                    e.target.value
                  )
                }
              />

            </Field>

            <div className="flex gap-2">

              {[
                'all',
                'available',
                'booked',
                'held',
                'blocked',
              ].map((s)=>(

                <button
                  key={s}
                  onClick={()=>
                    setStatusFilter(s)
                  }
                  className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${
                    statusFilter===s
                      ?'bg-brand-lavender text-white'
                      :'border border-brand-lavender/20 text-brand-ink/60'
                  }`}
                >
                  {s}
                </button>

              ))}

            </div>

          </div>

        </Card>

        <Card>

          <CardHeader
            title={`Slots (${pagination.total})`}
          />

          <Table
            empty={
              loading
                ?'Loading slots...'
                :'No slots found'
            }

            cols={[
              {
                key:'date',
                label:'Date',
                width:'110px',
              },

              {
                key:'time',
                label:'Time',
                width:'160px',
              },

              {
                key:'therapist',
                label:'Therapist',
                width:'150px',
              },

              {
                key:'service',
                label:'Service',
                width:'140px',
              },

              {
                key:'mode',
                label:'Mode',
                width:'100px',
              },

              {
                key:'status',
                label:'Status',
                width:'100px',
              },

              {
                key:'booking',
                label:'Booking',
                width:'120px',
              },

              {
                key:'actions',
                label:'',
                width:'80px',
              },
            ]}

            rows={slots.map(
              (s)=>[

                <span key="d">
                  {formatDate(
                    s.startAt,
                    {
                      day:'numeric',
                      month:'short',
                    }
                  )}
                </span>,

                <span
                  key="t"
                  className="font-medium"
                >
                  {formatTime(
                    s.startAt
                  )}{' '}
                  -
                  {' '}
                  {formatTime(
                    s.endAt
                  )}
                </span>,

                <span key="th">
                  {
                    s.therapist
                      ?.user?.name
                  }
                </span>,

                <span key="sv">
                  {
                    s.service?.name
                  }
                </span>,

                <Badge
                  key="m"
                  label={s.mode}
                  variant="gray"
                />,

                <Badge
                  key="st"
                  label={s.status}
                  variant={
                    STATUS_V[
                      s.status
                    ]
                  }
                />,

                s.appointment
                  ?(
                    <span
                      key="bk"
                      className="font-mono text-xs text-brand-lavender"
                    >
                      {
                        s.appointment
                          .bookingCode
                      }
                    </span>
                  )
                  :(
                    <span key="bk">
                      —
                    </span>
                  ),

                <div key="ac">

                  {s.status===
                    'available'&&(

                    <Btn
                      size="sm"
                      variant="danger"
                      onClick={()=>
                        toggleSlot(
                          s._id,
                          false
                        )
                      }
                    >
                      <Ban size={12}/>
                    </Btn>

                  )}

                  {s.status===
                    'blocked'&&(

                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={()=>
                        toggleSlot(
                          s._id,
                          true
                        )
                      }
                    >
                      Unblock
                    </Btn>

                  )}

                </div>,
              ]
            )}
          />

          <div className="flex items-center justify-between p-5 border-t border-brand-lavender/10">

            <p className="text-sm text-brand-ink/60">

              Page {page}
              {' '}of{' '}
              {pagination.pages}

            </p>

            <div className="flex gap-2">

              <Btn
                variant="default"
                disabled={page<=1}
                onClick={()=>
                  setPage(
                    (p)=>p-1
                  )
                }
              >
                <ChevronLeft size={14}/>
                Previous
              </Btn>

              <Btn
                variant="default"
                disabled={
                  page>=
                  pagination.pages
                }
                onClick={()=>
                  setPage(
                    (p)=>p+1
                  )
                }
              >
                Next
                <ChevronRight size={14}/>
              </Btn>

            </div>

          </div>

        </Card>

        <Modal
          open={genOpen}
          onClose={()=>
            setGenOpen(false)
          }
          title="Generate Slots"
          footer={
            <>

              <Btn
                variant="default"
                onClick={()=>
                  setGenOpen(false)
                }
              >
                Cancel
              </Btn>

              <Btn
                variant="default"
                loading={genLoading}
                onClick={
                  generateSlots
                }
              >
                Generate
              </Btn>

            </>
          }
        >

          <div className="space-y-4">

            <p className="text-sm text-brand-ink/60 leading-7">

              Generates slots from therapist weekly availability template.

              Existing future slots are skipped automatically.

            </p>

            <Field label="Therapist">

              <select
                className={inputCls}
                value={
                  selectedTherapist
                }
                onChange={(e)=>
                  setSelectedTherapist(
                    e.target.value
                  )
                }
              >

                {therapists.map(
                  (t)=>(

                    <option
                      key={t._id}
                      value={t._id}
                    >
                      {
                        t.user?.name??
                        t.slug
                      }
                    </option>

                  )
                )}

              </select>

            </Field>

            <div className="grid grid-cols-2 gap-4">

              <Field
                label="From Date"
                required
              >

                <input
                  type="date"
                  className={inputCls}
                  value={
                    genForm.from
                  }
                  onChange={(e)=>
                    setGenForm(
                      (p)=>({
                        ...p,
                        from:
                          e.target
                            .value,
                      })
                    )
                  }
                />

              </Field>

              <Field
                label="To Date"
                required
              >

                <input
                  type="date"
                  className={inputCls}
                  value={
                    genForm.to
                  }
                  onChange={(e)=>
                    setGenForm(
                      (p)=>({
                        ...p,
                        to:
                          e.target
                            .value,
                      })
                    )
                  }
                />

              </Field>

            </div>

            <div className="rounded-2xl bg-brand-lavender/5 border border-brand-lavender/10 p-4">

              <p className="text-xs text-brand-ink/50 leading-6">

                Tip:
                Generate slots for 4–8 weeks at a time.

                Re-running generation safely fills missing future slots without duplicates.

              </p>

            </div>

          </div>

        </Modal>

      </AdminPage>
    );
  }